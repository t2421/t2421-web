import { readJson } from "https://deno.land/x/jsonfile@1.0.0/mod.ts";
import { exec } from "https://deno.land/x/exec@0.0.5/mod.ts";

async function publishPackages() {
  // 実行ディレクトリからすべてのワークスペースパッケージを取得
  const result = await exec("pnpm list -r --json");
  const packages = JSON.parse(result.output) as Array<{ path: string }>;

  for (const pkg of packages) {
    const packageJsonPath = `${pkg.path}/package.json`;

    try {
      // package.json を読み込む
      const packageJson = await readJson(packageJsonPath) as {
        name: string;
        version: string;
        private?: boolean;
      };

      const { name, version } = packageJson;

      // npm view を使って公開済みバージョンを取得
      const npmViewResult = await exec(`npm view ${name} version`);
      const publishedVersion = npmViewResult.output.trim();

      if (publishedVersion === version) {
        console.log(`Skipping already published package: ${name}@${version}`);
        continue;
      }

      // 未公開の場合は公開
      console.log(`Publishing package: ${name}@${version}`);
      const command = new Deno.Command('pnpm', {
        args: ['publish', '--access', 'public', '--no-git-checks'],
        cwd: pkg.path,
        stdout: "inherit",
        stderr: "inherit",
      });
      const { success } = await command.output();
      if (!success) {
        throw new Error(`Failed to publish package at ${pkg.path}`);
      }
    } catch (error) {
      console.error(`Failed to process package at ${pkg.path}:`, error);
    }
  }
}

publishPackages().catch((error) => {
  console.error("Failed to publish packages:", error);
  Deno.exit(1);
});