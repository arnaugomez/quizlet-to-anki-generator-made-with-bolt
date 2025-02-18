"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import Papa from "papaparse";
import { Share2, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const formSchema = z
  .object({
    flashcards: z.string().min(1, "Please enter your flashcards"),
    termSeparator: z.enum(["tab", "comma", "custom"]),
    customTermSeparator: z.string().optional(),
    rowSeparator: z.enum(["newline", "semicolon", "custom"]),
    customRowSeparator: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.termSeparator === "custom" && !values.customTermSeparator) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customTermSeparator"],
        message: "Custom term separator cannot be empty",
      });
    }
    if (values.rowSeparator === "custom" && !values.customRowSeparator) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customRowSeparator"],
        message: "Custom row separator cannot be empty",
      });
    }
  });

type Values = z.infer<typeof formSchema>;

type Flashcard = {
  question: string;
  answer: string;
};

const defaultValues: Values = {
  flashcards: "",
  termSeparator: "tab",
  rowSeparator: "newline",
  customTermSeparator: "",
  customRowSeparator: "",
};

export default function HomePage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const getSeparator = (
    type: "term" | "row",
    values: z.infer<typeof formSchema>
  ) => {
    if (type === "term") {
      switch (values.termSeparator) {
        case "tab":
          return "\t";
        case "comma":
          return ",";
        case "custom":
          return values.customTermSeparator || " - ";
      }
    } else {
      switch (values.rowSeparator) {
        case "newline":
          return "\n";
        case "semicolon":
          return ";";
        case "custom":
          return values.customRowSeparator || "\n\n";
      }
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const termSeparator = getSeparator("term", values);
    const rowSeparator = getSeparator("row", values);

    const rows = values.flashcards.trim().split(rowSeparator);
    const cards = rows
      .filter((row) => row.trim())
      .map((row) => {
        const [question, answer = ""] = row.split(termSeparator);
        return {
          question: question.trim(),
          answer: answer.trim(),
        };
      });

    setFlashcards(cards);

    const csv = Papa.unparse(cards);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "flashcards.csv";
    link.click();
    URL.revokeObjectURL(link.href);

    setIsSuccess(true);
  };

  const shareApp = async () => {
    const url = window.location.href;

    // Check if Web Share API is supported and can share
    if (navigator.share && navigator.canShare?.({ url })) {
      try {
        await navigator.share({
          url,
        });
      } catch (error) {
        if (
          error &&
          (error as Record<string, string>)["name"] === "AbortError"
        ) {
          return;
        }

        // If user cancels or sharing fails, fallback to clipboard
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard", {
          description: "You can now share it with your friends!",
        });
      }
    } else {
      // Fallback for browsers without Web Share API
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard", {
        description: "You can now share it with your friends!",
      });
    }
  };

  const handleConvertMore = () => {
    form.reset(defaultValues);
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-3xl font-bold">Success!</h1>
            <p className="text-gray-600">
              Your flashcards have been converted and downloaded as CSV.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={shareApp} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={handleConvertMore}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Convert More
            </Button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Generated Flashcards</h2>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Answer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flashcards.map((card, index) => (
                    <TableRow key={index}>
                      <TableCell>{card.question || "-"}</TableCell>
                      <TableCell>{card.answer || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Quizlet to Anki Converter
            </h1>
            <p className="text-gray-600">
              Convert your Quizlet flashcards to Anki format in seconds
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="flashcards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paste your Quizlet flashcards here</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          "Term 1 - Definition 1\nTerm 2 - Definition 2"
                        }
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <FormField
                    control={form.control}
                    name="termSeparator"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Between term and definition</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="tab" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tab ( ↹ )
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="comma" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Comma
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="custom" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Custom
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("termSeparator") === "custom" && (
                    <FormField
                      control={form.control}
                      name="customTermSeparator"
                      render={({ field }) => (
                        <FormItem>
                          <div className="h-4"></div>
                          <FormLabel>Custom term separator</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter custom separator (e.g., ' - ')"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="rowSeparator"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Between rows</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="newline" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                New Line
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="semicolon" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Semicolon
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="custom" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Custom
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("rowSeparator") === "custom" && (
                    <FormField
                      control={form.control}
                      name="customRowSeparator"
                      render={({ field }) => (
                        <FormItem>
                          <div className="h-4"></div>
                          <FormLabel>Custom row separator</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter custom separator (e.g., '\n\n')"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Convert to Anki
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}
