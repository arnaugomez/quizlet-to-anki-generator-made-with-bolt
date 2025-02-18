import HomePage from "@/components/pages/home-page";

export async function generateMetadata() {
  return {
    title: "Quizlet to Anki Converter - Convert Flashcards Easily",
    description:
      "Convert your Quizlet flashcards to Anki format in seconds. Simple, fast, and efficient flashcard conversion tool.",
    keywords:
      "Quizlet, Anki, flashcards, converter, study, education, learning",
    author: "Arnau Gómez",
    openGraph: {
      title: "Quizlet to Anki Converter - Convert Flashcards Easily",
      description:
        "Convert your Quizlet flashcards to Anki format in seconds. Simple, fast, and efficient flashcard conversion tool.",
      url: `https://${process.env.VERCEL_URL}`,
      type: "website",
      images: [
        {
          url: `https://${process.env.VERCEL_URL}/web-app-manifest-512x512.png`,
          width: 800,
          height: 600,
          alt: "Quizlet to Anki Converter",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Quizlet to Anki Converter - Convert Flashcards Easily",
      description:
        "Convert your Quizlet flashcards to Anki format in seconds. Simple, fast, and efficient flashcard conversion tool.",
      creator: "@arnaugomez",
      images: [
        `https://${process.env.VERCEL_URL}/web-app-manifest-512x512.png`,
      ],
    },
  };
}

export default function Page() {
  return <HomePage />;
}
