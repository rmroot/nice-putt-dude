export interface IGolfCourse {
    id: string;
    name: string;
    holes: {
        hole1: GolfHole,
        hole2: GolfHole,
        hole3: GolfHole,
        hole4: GolfHole,
        hole5: GolfHole,
        hole6: GolfHole,
        hole7: GolfHole,
        hole8: GolfHole,
        hole9: GolfHole,
        hole10: GolfHole,
        hole11: GolfHole,
        hole12: GolfHole,
        hole13: GolfHole,
        hole14: GolfHole,
        hole15: GolfHole,
        hole16: GolfHole,
        hole17: GolfHole,
        hole18: GolfHole,
    }
}


export interface GolfHole {
    par: number;
}