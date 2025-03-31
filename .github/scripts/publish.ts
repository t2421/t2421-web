import { readJson } from "https://deno.land/x/jsonfile@1.0.0/mod.ts";
import { exec } from "https://deno.land/x/exec@0.0.5/mod.ts";

async function publishPackages() {
  try {
    // 実行ディレクトリからすべてのワークスペースパッケージを取得
    const result = await exec("pnpm list -r --json");
    const output = result.output.trim();

    // 出力が空の場合はエラーをスロー
    if (!output) {
      throw new Error("pnpm list -r --json returned an empty result.");
    }

    // JSON パースを試行
    let packages: Array<{ path: string }>;
    try {
      packages = JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to parse JSON from pnpm list -r --json: ${error.message}`);
    }

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
  } catch (error) {
    console.error("Failed to publish packages:", error);
    Deno.exit(1);
  }
}

publishPackages();