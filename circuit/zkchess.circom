pragma circom 2.1.6;
include "@zk-email/zk-regex-circom/circuits/common/from_addr_regex.circom";
include "@zk-email/circuits/email-verifier.circom";
include "@zk-email/circuits/utils/regex.circom";

include "./zkchess-mail-regex.circom";


template ZkChessVerifier(maxHeadersLength, maxBodyLength, n, k, exposeFrom) {
     assert(exposeFrom < 2);

    signal input emailHeader[maxHeadersLength];
    signal input emailHeaderLength;
    signal input pubkey[k];
    signal input signature[k];
    signal input emailBody[maxBodyLength];
    signal input emailBodyLength;
    signal input bodyHashIndex;
    signal input precomputedSHA[32];
    signal input chessMoveIndex;


    signal output pubkeyHash;
    signal output chessMove;


    component EV = EmailVerifier(maxHeadersLength, maxBodyLength, n, k, 0);
    EV.emailHeader <== emailHeader;
    EV.pubkey <== pubkey;
    EV.signature <== signature;
    EV.emailHeaderLength <== emailHeaderLength;
    EV.bodyHashIndex <== bodyHashIndex;
    EV.precomputedSHA <== precomputedSHA;
    EV.emailBody <== emailBody;
    EV.emailBodyLength <== emailBodyLength;

    pubkeyHash <== EV.pubkeyHash;


    // FROM HEADER REGEX: 736,553 constraints
    if (exposeFrom) {
        signal input fromEmailIndex;

        signal (fromEmailFound, fromEmailReveal[maxHeadersLength]) <== FromAddrRegex(maxHeadersLength)(emailHeader);
        fromEmailFound === 1;

        var maxEmailLength = 255;

        signal output fromEmailAddrPacks[9] <== PackRegexReveal(maxHeadersLength, maxEmailLength)(fromEmailReveal, fromEmailIndex);
    }


    
    signal (chessMoveFound, chessMoveReveal[maxBodyLength]) <== ZkChessMailRegex(maxBodyLength)(emailBody);
    chessMoveFound === 1;

    // Pack the move to int
    var maxMoveLength = 50;
    signal chessMovePacks[2] <== PackRegexReveal(maxBodyLength, maxMoveLength)(chessMoveReveal, chessMoveIndex);
   
    // Username will fit in one field element, so we take the first item from the packed array.
    chessMove <== chessMovePacks[1];
}

component main = ZkChessVerifier(1024, 1536, 121, 17, 0);