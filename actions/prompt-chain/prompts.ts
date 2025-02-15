export const OUTLINE_PROMPT = `
You are a creative writer tasked with generating a high-level plot outline for a short fictional narrative. Here is the input from the user: "{{input_sentence}}".

Based on this input, create a plot outline that includes the following elements:
- **Setting:** A brief description of the location or environment.
- **Genre:** The overall genre of the story.
- **Main Character:** A concise description of the protagonist.
- **Central Conflict:** The primary challenge or problem the character faces.
- **Key Events:** 3-5 bullet points outlining the main events that drive the narrative.

Ensure that the outline is clear, concise, and structured to serve as a solid foundation for a short story.
`;

export const STORY_GENERATION_PROMPT = `
Using the following plot outline: 

{{plot_outline}}

Please write a short story that meets the criteria below:

- Incorporate the setting, genre, main character, and conflict as specified in the outline.
- Include well-developed characters with distinct voices.
- Use dialogue to drive the narrative.
- Provide vivid descriptions of the setting and atmosphere.
- Ensure the story is concise and engaging, avoiding excessive length. Should be 800 words or less.

The final narrative should be easy to view and read while clearly following the provided outline.
`;
