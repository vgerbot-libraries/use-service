import { ApplicationContext } from '@vgerbot/ioc';
import React from 'react';
import { Newable } from '@vgerbot/ioc/dist/types/Newable';
export declare function Observable(): Function;
export type IoCProps = React.PropsWithChildren<{
    callback?: (appctx: ApplicationContext) => void;
}>;
export declare function IoC(props: IoCProps): React.FunctionComponentElement<React.ProviderProps<ApplicationContext | undefined>>;
export declare function useService<T>(ctor: Newable<T>): T;
export * from '@vgerbot/ioc';
