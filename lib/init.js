// 请求 fs-extra 库，用于文件操作
const fse = require("fs-extra");
// 请求 ora 库，用于初始化项目时等待动画
const ora = require("ora");
// 请求 chalk 库
const chalk = require("chalk");
// 请求 log-symbols 库
const symbols = require("log-symbols");

const path = require("path");

// 请求 download.js 文件，模板不在本地时执行该操作
const dlTemplate = require("./download");

async function initProject(projectName) {
  try {
    const exists = await fse.pathExists(projectName);
    if (exists) {
      // 项目重名时提醒用户
      console.log(symbols.warning, chalk.red("The project already exists."));
    } else {
      // Spinner 初始设置
      const initSpinner = ora(chalk.cyan("Initializing project..."));
      // 开始执行等待动画
      initSpinner.start();

      // 拼接 template 文件夹路径 我这里是从github上下载的zip压缩包 默认会有个“项目名-branch”的文件夹
      const templatePath = path.resolve(
        __dirname,
        "../template/vue-admin-main"
      );
      // 返回 Node.js 进程的当前工作目录
      const processPath = process.cwd();
      // 把项目名转小写
      const LCProjectName = projectName.toLowerCase();
      // 拼接项目完整路径
      const targetPath = `${processPath}/${LCProjectName}`;

      // 先判断模板路径是否存在
      const exists = await fse.pathExists(templatePath);
      if (!exists) {
        // 不存在时，就先等待下载模板，下载完再执行下面的语句
        await dlTemplate();
      }

      // 等待复制好模板文件到对应路径去
      try {
        await fse.copy(templatePath, targetPath);
      } catch (err) {
        // 如果出错，Spinner 就改变文字信息
        initSpinner.text = chalk.red(`Initialize project failed. ${err}`);
        // 终止等待动画并显示 X 标志
        initSpinner.fail();
        process.exit();
      }

      // 如果成功，Spinner 就改变文字信息
      initSpinner.text = "Initialize project successful.";
      // 终止等待动画并显示 ✔ 标志
      initSpinner.succeed();
      console.log(`
        To get started:

          cd ${chalk.yellow(LCProjectName)}
          ${chalk.yellow("npm install")} or ${chalk.yellow("yarn install")}
          ${chalk.yellow("npm run serve")} or ${chalk.yellow("yarn serve")}
      `);
    }
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

// 将上面的 initProject(projectName) 方法导出
module.exports = initProject;
