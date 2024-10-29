// app/write/page.tsx
import WriteForm from '@/components/WriteForm';

export default function WritePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-2xl font-medium text-gray-900">
            描述此刻的选择
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
          每一种选择，将带来十年后不同的你
          </p>
        </div>
        <WriteForm />
        <div className="text-center text-xs text-gray-400">
          <p>注：所有信息仅用于生成信件，不会被保存或分享。</p>
        </div>
      </div>
    </main>
  );
}