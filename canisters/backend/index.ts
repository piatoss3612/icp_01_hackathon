import {
    blob,
    bool,
    Canister,
    Func,
    nat16,
    None,
    Opt,
    query,
    Record,
    text,
    Tuple,
    Variant,
    Vec
} from 'azle';

const Token = Record({
    // add whatever fields you'd like
    arbitrary_data: text
});

const StreamingCallbackHttpResponse = Record({
    body: blob,
    token: Opt(Token)
});

export const Callback = Func([text], StreamingCallbackHttpResponse, 'query');

const CallbackStrategy = Record({
    callback: Callback,
    token: Token
});

const StreamingStrategy = Variant({
    Callback: CallbackStrategy
});

type HeaderField = [text, text];
const HeaderField = Tuple(text, text);

const HttpResponse = Record({
    status_code: nat16,
    headers: Vec(HeaderField),
    body: blob,
    streaming_strategy: Opt(StreamingStrategy),
    upgrade: Opt(bool)
});

const HttpRequest = Record({
    method: text,
    url: text,
    headers: Vec(HeaderField),
    body: blob,
    certificate_version: Opt(nat16)
});

export default Canister({
    http_request: query([HttpRequest], HttpResponse, (req) => {
        if (req.method != "GET") {
            return {
                status_code: 405,
                headers: [
                    ["Content-Type", "plain/text"],
                    ["Access-Control-Allow-Origin", "*"],
                ],
                body: Buffer.from('Method Not Allowed'),
                streaming_strategy: None,
                upgrade: None
            };
        }

        let obj = {};
        for (let [key, value] of req.headers) {
            obj[key] = value;
        }

        let headers = JSON.stringify(obj);


        return {
            status_code: 200,
            headers: [
                ["Content-Type", "application/json"],
                ["Access-Control-Allow-Origin", "*"],
            ],
            body: Buffer.from(headers),
            streaming_strategy: None,
            upgrade: None
        };
    })
});