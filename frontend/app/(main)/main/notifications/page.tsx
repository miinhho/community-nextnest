export default function NotificationPage() {
  return (
    <div className="flex min-h-screen">
      {/* 메인 콘텐츠 영역 */}
      <div className="flex overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">알림</h1>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">알림 콘텐츠 영역</p>
          </div>
        </div>
      </div>
    </div>
  )
}
