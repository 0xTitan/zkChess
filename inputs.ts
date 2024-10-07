import { bytesToBigInt, fromHex } from "@zk-email/helpers";
import { generateEmailVerifierInputs } from "@zk-email/helpers";
import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim"
import fs from "fs"
import path from "path"
 
export const STRING_PRESELECTOR = "Next move from @";
export const MAX_HEADER_PADDED_BYTES = 576;
export const MAX_BODY_PADDED_BYTES = 832;
 
export async function generateChessMoveVerifierCircuitInputs() {
    const rawEmail = fs.readFileSync(
        path.join(__dirname, "./emls/mail-good.eml")      );
    const dkimResult = await verifyDKIMSignature(rawEmail);
    const emailVerifierInputs = await generateEmailVerifierInputs(rawEmail,{
        maxBodyLength:MAX_BODY_PADDED_BYTES,
        maxHeadersLength:576,        
        shaPrecomputeSelector: ""

    });
 
    const bodyRemaining = emailVerifierInputs.emailBody!.map(c => Number(c));
    let emailBodyString = emailVerifierInputs.emailBody ? Buffer.from(emailVerifierInputs.emailBody.map(Number)).toString('ascii'):null;
    const emailHeaderString = emailVerifierInputs.emailHeader ? Buffer.from(emailVerifierInputs.emailHeader.map(Number)).toString('ascii'):null;
    const selectorBuffer = Buffer.from(STRING_PRESELECTOR);
    const moveIndex = Buffer.from(bodyRemaining).indexOf(selectorBuffer) + selectorBuffer.length-1;
    console.log("###################");
    console.log("#######Body#########");
    console.log("###################");
    console.log("###################");
     console.log("emailBodyString : ", emailBodyString);
     console.log("###################");
    console.log("########Header########");
    console.log("###################");
    console.log("###################");
     console.log("emailHeaderString : ", emailHeaderString);
     console.log("###################");
     console.log("###################");

     let match;
     match = emailBodyString!.match(new RegExp(STRING_PRESELECTOR));
     if (match){
        console.log("match");
        console.log(match.index);
        console.log(match[0].length);
        let newMoveIndexFromString = match?.index;
        let newMoveLengthFromString = match[0].length -1;
        console.log(newMoveIndexFromString ? (newMoveIndexFromString + newMoveLengthFromString) : (0 + newMoveLengthFromString));
     }

    // console.log("selectorBuffer : ", selectorBuffer);
    // console.log("moveIndex : ", moveIndex);
     //console.log("emailVerifierInputs : ", emailVerifierInputs);
 
    //const address = bytesToBigInt(fromHex("0x71C7656EC7ab88b098defB751B7401B5f6d897")).toString();
 
    const inputJson = {
        ...emailVerifierInputs,
        moveIndex: moveIndex.toString()
    };
    //console.log("inputJson : ", inputJson);
    fs.writeFileSync("./input.json", JSON.stringify(inputJson))
}

export async function generateChessMoveVerifierCircuitInputsForWasm() {
    const rawEmail = fs.readFileSync(
        path.join(__dirname, "./emls/mail-good.eml")      );
    const dkimResult = await verifyDKIMSignature(rawEmail);
    const emailVerifierInputs = await generateEmailVerifierInputs(rawEmail,{
        maxBodyLength:MAX_BODY_PADDED_BYTES,
        maxHeadersLength:576,        
        shaPrecomputeSelector: ""

    });
 
    const bodyRemaining = emailVerifierInputs.emailBody!.map(c => Number(c));
    let emailBodyString = emailVerifierInputs.emailBody ? Buffer.from(emailVerifierInputs.emailBody.map(Number)).toString('ascii'):null;
    const emailHeaderString = emailVerifierInputs.emailHeader ? Buffer.from(emailVerifierInputs.emailHeader.map(Number)).toString('ascii'):null;
    const selectorBuffer = Buffer.from(STRING_PRESELECTOR);
    const moveIndex = Buffer.from(bodyRemaining).indexOf(selectorBuffer) + selectorBuffer.length-1;

     let match;
     match = emailBodyString!.match(new RegExp(STRING_PRESELECTOR));
     let regexInputs = {};
     if (match){
        console.log("match");
        console.log(match.index);
        console.log(match[0].length);
        let newMoveIndexFromString = match?.index;
        let newMoveLengthFromString = match[0].length -1;
        console.log(newMoveIndexFromString ? (newMoveIndexFromString + newMoveLengthFromString) : (0 + newMoveLengthFromString));

        regexInputs = {
            ...regexInputs,
            moveIndex: moveIndex
        }
     }

    // console.log("selectorBuffer : ", selectorBuffer);
    // console.log("moveIndex : ", moveIndex);
     //console.log("emailVerifierInputs : ", emailVerifierInputs);
 
    //const address = bytesToBigInt(fromHex("0x71C7656EC7ab88b098defB751B7401B5f6d897")).toString();
    const packedInputs = {};
    return {
        ...emailVerifierInputs,
        ...regexInputs,
        ...packedInputs
    }   
}
 
(async () => {
    await generateChessMoveVerifierCircuitInputs();
}) ();
 