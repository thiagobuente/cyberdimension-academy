import { describe, expect, it } from "vitest";
import {
  getPodcastQuiz,
  getPublicPodcastQuiz,
  gradePodcastQuiz,
  podcastQuizEpisodes,
} from "../shared/podcastQuizzes";
import { podcastEpisodes } from "../shared/podcastEpisodes";

describe("CyberCast review-quiz bank", () => {
  it("covers every published episode with exactly five questions", () => {
    for (const episode of podcastEpisodes) {
      const questions = getPodcastQuiz(episode.id);
      expect(questions.length, `quiz missing or wrong size for ${episode.id}`).toBe(5);
      for (const [index, question] of questions.entries()) {
        expect(question.id).toMatch(/^ep\d{2}(-[a-z0-9-]+)?-q\d$/);
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(question.correctAnswer).toBeLessThan(question.options.length);
        expect(question.id).toBe(questions[index].id);
      }
    }
  });

  it("returns an empty quiz for unknown episodes", () => {
    expect(getPodcastQuiz("episode-does-not-exist")).toEqual([]);
  });

  it("returns public questions without the answer key", () => {
    const publicQuiz = getPublicPodcastQuiz(podcastEpisodes[0].id);
    expect(publicQuiz.length).toBe(5);
    for (const question of publicQuiz) {
      expect((question as Record<string, unknown>).correctAnswer).toBeUndefined();
      expect((question as Record<string, unknown>).explanation).toBeUndefined();
      expect((question as Record<string, unknown>).prompt).toBeTruthy();
    }
  });

  it("gradePodcastQuiz returns null for invalid input", () => {
    expect(gradePodcastQuiz("episode-does-not-exist", [0, 1, 2, 3, 0])).toBeNull();
    expect(gradePodcastQuiz(podcastEpisodes[0].id, [0, 1])).toBeNull();
    expect(gradePodcastQuiz(podcastEpisodes[0].id, [0, 1, 2, 3, 0, 0])).toBeNull();
  });

  it("gradePodcastQuiz computes score and review with hidden explanations revealed", () => {
    const firstEpisode = podcastEpisodes[0];
    const questions = getPodcastQuiz(firstEpisode.id);
    const shuffledAnswers = questions.map((question) => (question.correctAnswer + 1) % question.options.length);
    const grade = gradePodcastQuiz(firstEpisode.id, shuffledAnswers);
    expect(grade).not.toBeNull();
    expect(grade!.totalQuestions).toBe(5);
    expect(grade!.score).toBeLessThanOrEqual(5);
    expect(grade!.percentage).toBe(Math.round((grade!.score / 5) * 100));
    expect(grade!.review.length).toBe(5);
    for (const item of grade!.review) {
      expect(item).toHaveProperty("correct");
      expect(item).toHaveProperty("explanation");
    }
  });

  it("gradePodcastQuiz reports a perfect score when answers match the key", () => {
    const firstEpisode = podcastEpisodes[0];
    const questions = getPodcastQuiz(firstEpisode.id);
    const grade = gradePodcastQuiz(firstEpisode.id, questions.map((question) => question.correctAnswer));
    expect(grade!.score).toBe(5);
    expect(grade!.percentage).toBe(100);
    expect(grade!.review.every((item) => item.correct)).toBe(true);
  });

  it("lists all quiz episode ids matching the published catalog", () => {
    const quizKeys = podcastQuizEpisodes.map((key) => Number(key.replace("ep", "").split("-")[0]));
    const episodeNumbers = podcastEpisodes.map((episode) => Number(episode.id.replace("ep", "").split("-")[0]));
    expect(quizKeys.sort((first, second) => first - second)).toEqual(episodeNumbers.sort((first, second) => first - second));
  });
});
