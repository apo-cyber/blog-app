// src/app/about/page.tsx

import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="min-h-screen gradient-bg-subtle">
      {/* ヒーローセクション（ヘッダー含む） */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/hero3.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* ヘッダー */}
        <Header />

        {/* ヒーローコンテンツ */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src="/apo.jpg"
              alt="apo-cyber プロフィール写真"
              fill
              priority
              className="object-cover rounded-full shadow-xl border-4 border-white"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            apo-cyber
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-bold">
            技術と創造性を融合させて、より良い体験を作り出そう！！
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 自己紹介セクション */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">自己紹介</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* テキスト部分 */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  こんにちは！私は、世界線が異なる平行世界からやってきた{" "}
                  <strong className="text-blue-500">apo-cyber</strong>です。
                  見た目はこの世界で言うネコに似ていますが、実は高度なインテリジェンスを持つ存在です。
                </p>
                <p className="mb-4">
                  科学的な知見を通して、価値のあるプロダクトを作ることに喜びを感じています。
                  常に新しい知識を吸収し、より効率的で美しいソリューションを追求しています。
                </p>
                <p>
                  このブログでは、データサイエンスだけでなく、デザイン、自然科学、ミステリー、旅など、個人的な学びや発見について書いています。
                  読者の皆さんと知識を共有し、一緒に成長しましょう！！
                </p>
              </div>
            </div>

            {/* 画像部分 */}
            <div className="lg:col-span-1 flex justify-center lg:justify-end">
              <div className="relative w-48 h-48">
                <Image
                  src="/apo.jpg"
                  alt="apo-cyber プロフィール写真"
                  fill
                  className="object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  A
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 趣味・興味 */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">趣味・興味</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                プログラミング
              </h3>
              <p className="text-sm text-gray-600">
                新しい技術やフレームワークを学ぶことが好きです
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">読書</h3>
              <p className="text-sm text-gray-600">
                ミステリーや哲学書まで幅広く読んでいます
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/* 釣り竿 */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                  {/* 釣り糸 */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-3-3"
                  />
                  {/* 魚のフック */}
                  <circle cx="17" cy="17" r="1" fill="currentColor" />
                  {/* 魚 */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19c1.5 0 3-1 3-2.5S16.5 14 15 14c-1.5 0-3 1-3 2.5S13.5 19 15 19z"
                  />
                  {/* 魚の尾びれ */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 16.5l-2-1.5 2-1.5"
                  />
                  {/* 魚の目 */}
                  <circle cx="14.5" cy="16.5" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fishing</h3>
              <p className="text-sm text-gray-600">
                自然の中でリラックスしながら魚と向き合う時間が好きです
              </p>
            </div>
          </div>
        </Card>

        {/* 趣味別ひとことログ */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            趣味別ひとことログ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* プログラミング */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                プログラミング
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">React/Next.js</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-700">TypeScript</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-700">Tailwind CSS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Django,DRF</span>
                </div>
              </div>
            </div>

            {/* バックエンド */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">読書</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">サスペンス・ミステリー</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">癒し系ノベルズ</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                  <span className="text-gray-700">SF・ファンタジー</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">哲学・禅</span>
                </div>
              </div>
            </div>

            {/* Fishing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Fishing
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                  <span className="text-gray-700">ルアーフィッシング</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">渓流</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">ボートクルージング</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">旅・アウトドア</span>
                </div>
              </div>
            </div>

            {/* これからやりたいこと */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                これからやりたいこと
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">データサイエンス</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">
                    本屋での興味のある本を探す
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-gray-700">関西の渓流釣り</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 連絡先・SNS */}
        {/* <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">連絡先</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              質問やコラボレーションのご相談、お気軽にお声がけください！
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/apo-cyber"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/apo_cyber"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="mailto:apo@email.com"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </Card> */}
      </main>
    </div>
  );
}
