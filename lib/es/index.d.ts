import React from 'react';
import { TSubscribe } from 'pusu';
export declare type TUseSubscribe = () => TSubscribe;
export declare const createPublication: import("pusu").TCreatePublication;
export declare const publish: import("pusu").TPublish;
export declare const subscribe: TSubscribe;
export declare type TWithSubscribe = (Component: React.ComponentType<{
    subscribe: TSubscribe;
}>) => React.ComponentType;
export declare const withSubscribe: TWithSubscribe;
