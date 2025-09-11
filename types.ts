
export enum MessageSource {
    AI = 'AI',
    SYSTEM = 'SYSTEM',
}

export interface TutorMessage {
    source: MessageSource;
    text: string;
}

export interface BuggyCodeResponse {
    buggyCode: string;
    correctCode: string;
    explanation: string;
}
