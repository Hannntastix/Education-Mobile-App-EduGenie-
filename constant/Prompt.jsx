import dedent from "dedent";

export default {
  IDEA: dedent`
    As you are coaching teacher
    - User want to learn about the topic
    - Generate 5-7 Course title for study (Short)
    - Make sure it is related to description
    - Output will be ARRAY of String in JSON FORMAT only
    - Do not add any plain text in output
  `,

  COURSE: dedent`
You are a course creator AI.

Instructions:
- Based on the provided topics, create 2 full courses.
- Each course must include:
  - courseTitle (string)
  - description (string)
  - banner_image (choose one: "/banner1.png", "/banner2.png", "/banner3.png", "/banner4.png")
  - chapters: Array of 3 chapters. Each chapter includes:
    - chapterName (string)
    - content: Array of sections. Each section includes:
      - topic (string, 2 to 4 words)
      - explain (string, detailed explanation)
      - code (string or null)
      - example (string or null)
  - quiz: Array of 5 quiz questions. Each includes:
    - question (string)
    - options (array of 4 strings)
    - correctAns (string)
  - flashcards: Array of 10 flashcards. Each includes:
    - front (string)
    - back (string)
  - qa: Array of 5 Q&A. Each includes:
    - question (string)
    - answer (string)

⚠️ Response format:
Return only valid JSON in this format:

{
  "courses": [
    {
      "courseTitle": "string",
      "description": "string",
      "banner_image": "/banner1.png",
      "chapters": [...],
      "quiz": [...],
      "flashcards": [...],
      "qa": [...]
    },
    {...}
  ]
}
`

};

