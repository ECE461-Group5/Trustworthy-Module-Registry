import { DeepPartial } from 'ts-essentials';
import { Mock } from 'vitest';

type MatcherFn<T> = (actualValue: T) => boolean;
declare class Matcher<T> {
    readonly asymmetricMatch: MatcherFn<T>;
    private readonly description;
    $$typeof: symbol;
    inverse?: boolean;
    constructor(asymmetricMatch: MatcherFn<T>, description: string);
    toString(): string;
    toAsymmetricMatcher(): string;
    getExpectedType(): string;
}
declare class CaptorMatcher<T> {
    $$typeof: symbol;
    readonly asymmetricMatch: MatcherFn<T>;
    readonly value: T;
    readonly values: T[];
    constructor();
    getExpectedType(): string;
    toString(): string;
    toAsymmetricMatcher(): string;
}
interface MatcherCreator<T, E = T> {
    (expectedValue?: E): Matcher<T>;
}
type MatchersOrLiterals<Y extends unknown[]> = {
    [K in keyof Y]: Matcher<Y[K]> | Y[K];
};
declare const any: MatcherCreator<unknown>;
declare const anyBoolean: MatcherCreator<boolean>;
declare const anyNumber: MatcherCreator<number>;
declare const anyString: MatcherCreator<string>;
declare const anyFunction: MatcherCreator<CallableFunction>;
declare const anySymbol: MatcherCreator<symbol>;
declare const anyObject: MatcherCreator<unknown>;
declare const anyArray: MatcherCreator<unknown[]>;
declare const anyMap: MatcherCreator<Map<unknown, unknown>>;
declare const anySet: MatcherCreator<Set<unknown>>;
declare const isA: MatcherCreator<any>;
declare const arrayIncludes: MatcherCreator<unknown[], unknown>;
declare const setHas: MatcherCreator<Set<unknown>, unknown>;
declare const mapHas: MatcherCreator<Map<unknown, unknown>, unknown>;
declare const objectContainsKey: MatcherCreator<Record<string, unknown>, string>;
declare const objectContainsValue: MatcherCreator<Record<string, unknown> | ArrayLike<unknown>>;
declare const notNull: MatcherCreator<unknown>;
declare const notUndefined: MatcherCreator<unknown>;
declare const notEmpty: MatcherCreator<unknown>;
declare const captor: <T>() => CaptorMatcher<T>;
declare const matches: <T>(matcher: MatcherFn<T>) => Matcher<T>;

type FallbackImplementation<Y extends any[], T> = (...args: Y) => T;

type ProxiedProperty = string | number | symbol;
interface GlobalConfig {
    ignoreProps?: ProxiedProperty[];
}
declare const VitestMockExtended: {
    DEFAULT_CONFIG: GlobalConfig;
    configure: (config: GlobalConfig) => void;
    resetConfig: () => void;
};
interface CalledWithMock<T, Y extends any[]> extends Mock<FallbackImplementation<Y, T>> {
    calledWith: (...args: Y | MatchersOrLiterals<Y>) => Mock<FallbackImplementation<Y, T>>;
}
type _MockProxy<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer B ? T[K] & CalledWithMock<B, A> : T[K];
};
type MockProxy<T> = _MockProxy<T> & T;
type _DeepMockProxy<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer B ? T[K] & CalledWithMock<B, A> : T[K] & _DeepMockProxy<T[K]>;
};
type DeepMockProxy<T> = _DeepMockProxy<T> & T;
type _DeepMockProxyWithFuncPropSupport<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer B ? CalledWithMock<B, A> & DeepMockProxy<T[K]> : DeepMockProxy<T[K]>;
};
type DeepMockProxyWithFuncPropSupport<T> = _DeepMockProxyWithFuncPropSupport<T> & T;
interface MockOpts {
    deep?: boolean;
    useActualToJSON?: boolean;
    fallbackMockImplementation?: (...args: any[]) => any;
}
declare const mockClear: (mock: MockProxy<any>) => any;
declare const mockReset: (mock: MockProxy<any>) => any;
declare function mockDeep<T>(opts: {
    funcPropSupport?: true;
    fallbackMockImplementation?: MockOpts['fallbackMockImplementation'];
}, mockImplementation?: DeepPartial<T>): DeepMockProxyWithFuncPropSupport<T>;
declare function mockDeep<T>(mockImplementation?: DeepPartial<T>): DeepMockProxy<T>;
declare const mock: <T, MockedReturn extends MockProxy<T> & T = _MockProxy<T> & T>(mockImplementation?: DeepPartial<T>, opts?: MockOpts) => MockedReturn;
declare const mockFn: <T, A extends any[] = T extends (...args: infer AReal) => any ? AReal : any[], R = T extends (...args: any) => infer RReal ? RReal : any>() => CalledWithMock<R, A> & T;
declare const stub: <T extends object>() => T;

type CalledWithFnArgs<Y extends any[], T> = {
    fallbackMockImplementation?: FallbackImplementation<Y, T>;
};
declare const calledWithFn: <T, Y extends any[]>({ fallbackMockImplementation }?: CalledWithFnArgs<Y, T>) => CalledWithMock<T, Y>;

export { type CalledWithMock, CaptorMatcher, type DeepMockProxy, type GlobalConfig, Matcher, type MatcherCreator, type MatcherFn, type MatchersOrLiterals, type MockOpts, type MockProxy, VitestMockExtended, any, anyArray, anyBoolean, anyFunction, anyMap, anyNumber, anyObject, anySet, anyString, anySymbol, arrayIncludes, calledWithFn, captor, isA, mapHas, matches, mock, mockClear, mockDeep, mockFn, mockReset, notEmpty, notNull, notUndefined, objectContainsKey, objectContainsValue, setHas, stub };
//# sourceMappingURL=index.d.cts.map
