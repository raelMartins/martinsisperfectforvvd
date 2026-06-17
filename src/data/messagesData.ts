import type { Conversation, Message } from "@/types/message";
import { loomShareUrl, loomThumbnailUrl } from "@/lib/loom";

const LOOM_INTRO_ID = "4287b0e0f9b745339206340682040106";
const LOOM_PROJECT_ID = "40049d7eb1f942fb9324b32b7df7b1e1";

export const conversation: Conversation = {
  id: "vvd-product-engineer",
  title: "Zied & Haseeb",
  participants: ["Zied", "Haseeb"],
  lastPreview: "😂I love the sound of that.",
  lastTimestamp: "Now",
  unread: false,
};

export const messages: Message[] = [
  {
    id: "msg-001",
    sender: "me",
    text: "Hey guys! Heard you were looking for a Product Engineer?",
  },
  {
    id: "msg-002",
    sender: "zied",
    text: "Yes...and you are...?",
  },
  {
    id: "msg-003",
    sender: "me",
    text: "My bad.  I guess I should introduce myself. I'm Martins, and I'm pretty sure I'm exactly what you're looking for.",
  },
  {
    id: "msg-004",
    sender: "zied",
    text: "Okay. Bold. Hi Martins. Still not an introduction though.",
  },
  {
    id: "msg-005",
    sender: "me",
    text: "😂Fair enough. How bout this. I'll just send you a quick lil video. Give you the crash course. What do you think?",
  },
  {
    id: "msg-006",
    sender: "zied",
    text: "Sure. Why not",
  },
  {
    id: "msg-007",
    sender: "me",
    video: {
      shareUrl: loomShareUrl(LOOM_INTRO_ID),
      thumbnail: loomThumbnailUrl(LOOM_INTRO_ID),
      provider: "loom",
      title: "Quick intro — crash course",
    },
  },
  {
    id: "msg-008",
    sender: "haseeb",
    text: "Alright Martins. Nice to meet you! Thing is, there's a whole world of developers out there. What makes you, as you put it, \"exactly what we're looking for\"?",
  },
  {
    id: "msg-009",
    sender: "me",
    text: "I know. Big statement to make, I know. But hang with me for a second.",
  },
  {
    id: "msg-010",
    sender: "me",
    text: "Remember how I said I absolutely love Harry Potter.",
  },
  {
    id: "msg-011",
    sender: "zied",
    text: "Yeah...?",
  },
  {
    id: "msg-012",
    sender: "me",
    image: {
      images: [
        {
          src: "/media/harry-potter-boxset.png",
          alt: "Harry Potter complete collection boxset",
        },
        {
          src: "/media/hogwarts-miniature.png",
          alt: "Miniature Hogwarts castle model",
        },
      ],
      caption:
        "Keeping this boxset as a collector's item. And yes, that's a miniature Hogwarts model.",
    },
  },
  {
    id: "msg-013",
    sender: "me",
    text: "Well, I have nearly the same amount of love for Percy Jackson. And the Throne of  Glass series.",
  },
  {
    id: "msg-014",
    sender: "me",
    text: "and Twilight (never picked a team. But if I had to, probably Jacob)",
  },
  {
    id: "msg-015",
    sender: "me",
    text: "and the princess diaries, Game of Thrones, the vampire diaries... you get the idea😂.",
  },
  {
    id: "msg-016",
    sender: "me",
    text: "point is, I'm a sucker for immersion. I love being able to pick up any piece of fiction, book, tv show... anything. And then get lost in it. It is one of life's greatest pleasures. Being able to transport myself into a different world is so freeing.",
  },
  {
    id: "msg-017",
    sender: "haseeb",
    text: "I hear you.",
  },
  {
    id: "msg-018",
    sender: "me",
    text: "You know the movie Ready player one?",
  },
  {
    id: "msg-019",
    sender: "haseeb",
    text: "Uh huh.",
  },
  {
    id: "msg-020",
    sender: "me",
    text: "That is the dream. Building worlds where people can step back from reality, explore, and just be whoever they want to be. That sounds like bliss to me. I'm writing all this to say: I see the vision vvd is chasing, and I'm already right there with you.",
  },
  {
    id: "msg-021",
    sender: "zied",
    text: "Okay... okay. I hear you. That all sounds pretty good. We're on similar wavelengths here. But now I gotta know. Can you build.",
  },
  {
    id: "msg-022",
    sender: "me",
    text: "Glad you asked. Another video incoming.",
  },
  {
    id: "msg-023",
    sender: "zied",
    text: "Lol, okay. Let's see this😂.",
  },
  {
    id: "msg-024",
    sender: "me",
    video: {
      shareUrl: loomShareUrl(LOOM_PROJECT_ID),
      thumbnail: loomThumbnailUrl(LOOM_PROJECT_ID),
      provider: "loom",
      title: "3D Allocations project walkthrough",
    },
  },
  {
    id: "msg-025",
    sender: "me",
    text: "What do you think?",
  },
  {
    id: "msg-026",
    sender: "haseeb",
    text: "Okay, that's a seriously impressive architecture.",
  },
  {
    id: "msg-027",
    sender: "me",
    text: "Thanks😊. Wanna guess what technologies it was built with?",
  },
  {
    id: "msg-028",
    sender: "zied",
    text: "I was literally just about to ask😂.",
  },
  {
    id: "msg-029",
    sender: "me",
    text: "Great minds... And if you'd guessed, TypeScript with React, NextJS and ThreeJS, all using Cursor, you'd be right.",
  },
  {
    id: "msg-030",
    sender: "zied",
    text: "Okay that's awesome. Our exact stack!",
  },
  {
    id: "msg-031",
    sender: "me",
    textWithClickTarget: {
      before:
        "Yup. Last little cherry on top. this entire chat interface we're using right now? Built with that exact same setup. In fact, you can view every single prompt and architectural decision I used to spin up this site right ",
      clickTarget: {
        label: "here",
        action: { type: "prompt-gallery-modal" },
      },
      after: "",
    },
  },
  {
    id: "msg-032",
    sender: "haseeb",
    text: "I've seen enough. We'll be in touch!",
  },
  {
    id: "msg-033",
    sender: "me",
    text: "😂I love the sound of that.",
  },
];
