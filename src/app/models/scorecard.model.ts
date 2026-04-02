import { GolfHole } from "./golf-course.model";

export interface IScorecard {
    id: string;
    userId: string;
    courseId: string;
    matchId: string;
    date: Date;
    holes: {
        hole1: ScorecardHole,
        hole2: ScorecardHole,
        hole3: ScorecardHole,
        hole4: ScorecardHole,
        hole5: ScorecardHole,
        hole6: ScorecardHole,
        hole7: ScorecardHole,
        hole8: ScorecardHole,
        hole9: ScorecardHole,
        hole10: ScorecardHole,
        hole11: ScorecardHole,
        hole12: ScorecardHole,
        hole13: ScorecardHole,
        hole14: ScorecardHole,
        hole15: ScorecardHole,
        hole16: ScorecardHole,
        hole17: ScorecardHole,
        hole18: ScorecardHole,
    }
}

export interface ScorecardHole extends GolfHole {
    strokes: number;
}