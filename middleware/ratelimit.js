import rateLimit from "express-rate-limit";
import {TIMER_FOR_TENSECOND} from "./timerstate.js";

export const rate_limit = rateLimit ({
    windowMs: TIMER_FOR_TENSECOND, // 10 sec
    max: 10,
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
})