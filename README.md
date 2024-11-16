# Future You - 对话十年后的自己

这是一款独特的决策辅助应用，通过模拟"来自十年后的自己的信件"帮助用户在人生的关键抉择时刻获得洞见。用户通过分享当下面临的选择，可以收到两封来自不同未来轨迹的信件，从而从更长远的视角审视当前的决定。

## 🌟 特点

- **平行时空对话**：生成两封来自不同选择后的未来信件
- **智能对话补充**：AI会通过温暖的对话收集必要的背景信息
- **优雅的视觉体验**：精心设计的动画和界面交互
- **注重隐私**：所有信息仅用于生成信件，不会被保存
- **轻量级设计**：快速加载，流畅体验

## 🛠️ 技术栈

- **前端框架**: Next.js 14
- **样式方案**: Tailwind CSS
- **状态管理**: Zustand
- **UI组件**: shadcn/ui
- **动画效果**: Framer Motion
- **AI模型**: 智谱 GLM-4-FLASH
- **部署平台**: Vercel

## 📦 安装与运行

1. 克隆项目
```bash
git clone https://github.com/your-username/future-you.git
cd future-you
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env.local` 文件：
```
NEXT_PUBLIC_ZHIPU_API_KEY=your_api_key
```

4. 运行开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 🚀 部署

项目已配置为可直接部署到 Vercel 平台：

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 完成部署

## 📝 使用说明

1. 访问应用首页
2. 输入基本信息（称呼、性别、出生年份）
3. 描述当前面临的两个选择和相关背景
4. 选择是否通过对话补充更多信息
5. 等待生成并查看来自未来的两封信

## 🔑 API 密钥配置

本项目使用智谱 AI 的 GLM-4-FLASH 模型。你需要：

1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册并创建 API 密钥
3. 在环境变量中配置 `NEXT_PUBLIC_ZHIPU_API_KEY`

## 🤝 贡献

欢迎通过以下方式贡献：

- 提交 Issue 报告问题或建议新功能
- 提交 Pull Request 改进代码
- 完善文档

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解更多信息

## 🔗 相关链接

- [在线体验](https://futureyou.aiself.site)
- [智谱 AI 开发文档](https://open.bigmodel.cn/dev/api)
- [技术博客](https://www.xiaohongshu.com/user/profile/5ba4bc246574cf0001d3321e)

## 💌 联系方式

- 小红书：@Richi
- 即刻：@Rik5

---

如果这个项目对你有帮助，欢迎给个 ⭐️
