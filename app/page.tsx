import HomePage from "@/components/pages/home-page";

export async function generateMetadata() {
  return {
    title: "Quizlet to Anki Converter - Convert Flashcards Easily",
    description:
      "Convert your Quizlet flashcards to Anki format in seconds. Simple, fast, and efficient flashcard conversion tool.",
    keywords:
      "Quizlet, Anki, flashcards, converter, study, education, learning",
    author: "Your Name",
    openGraph: {
      title: "Quizlet to Anki Converter - Convert Flashcards Easily",
      description:
        "Convert your Quizlet flashcards to Anki format in seconds. Simple, fast, and efficient flashcard conversion tool.",
      url: `https://${process.env.VERCEL_URL}`,
      type: "website",
      images: [
        {
          url: `https://${process.env.VERCEL_URL}/og-image.jpg`,
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
      images: [`https://${process.env.VERCEL_URL}/twitter-image.jpg`],
    },
  };
}

export default function Page() {
  return <HomePage />;
}
