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

  // Chapter Explain in HTML Form, (Code example if required)
  COURSE: dedent`: As you are coaching teacher
    - User want to learn about all topics
    - Create 2 Courses With Course Name, Description, and 3 Chapters
    - Make sure to add chapters with all learning material course
    - Add CourseBanner Image from ('/banner1.png','/banner2.png','/banner3.png','/banner4.png')
    - Explain the chapter content as detailed tutorial
    - Generate 5 Quizz, 10 Flashcard and 5 Questions answer

    - Output in JSON Format only
    - "courses": [
      {
        "courseTitle": '<Intro to Python>',
        "description": '',
        "banner_image": '/banner1.png',
        "chapters": [
          {
            chapterName: '',
            content: [
              {
                topic: '<Topic Name in 2 to 4 worlds ex.(Creating Value)>'
                explain: '< Detailed Explaination tutorial>',
                code: '<Code example of required else null',
                example: '< example of required else null'
              }
            ],
            "codeExample": ""
          }
        ],
        quiz: [
          {
            question: '',
            options: ['a',b,c,d],
            correctAns: ''
          }
        ],
        flashcards: [
          {
            front: '',
            back: ''
          }
        ],
        qa: [
          {
            question: '',
            answer: ''
          }
        ]
      }
    ]
  `
};

