import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity'

// Initialize the matcher with the English dataset and transformers
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

// Function to check if the input contains profanity
export const containsProfanity = (inputText: string): boolean => {
  return matcher.hasMatch(inputText)
}
