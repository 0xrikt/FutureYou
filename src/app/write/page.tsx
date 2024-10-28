import WriteForm from '@/components/WriteForm';

export default function WritePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            写给未来的信
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            在这里，你将收到来自十年后的两个平行宇宙中的自己写来的信。
            让我们一起探索不同选择可能带来的未来吧。
          </p>
        </div>
        <WriteForm />
        <div className="text-center text-sm text-gray-500">
          <p>注：所有信息仅用于生成信件，不会被保存或分享。</p>
        </div>
      </div>
    </main>
  );
}