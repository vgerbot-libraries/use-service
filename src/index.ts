import { ApplicationContext, Mark } from '@vgerbot/ioc';
import React, { useContext, useRef } from 'react';
import { Newable } from '@vgerbot/ioc/dist/types/Newable';
import { PartialInstAwareProcessor } from '@vgerbot/ioc/dist/types/InstantiationAwareProcessor';
import { makeAutoObservable, makeObservable } from 'mobx';
import { Observer } from 'mobx-react-lite';

const IoCContext = React.createContext<ApplicationContext | undefined>(undefined);

const MARK_AS_MOBX_OBSERVABLE = 'mark-as-mobx-observable';

const MARK_AS_MOBX_AUTO_OBSERVABLE = 'mark-as-mobx-auto-observerable';

export function Observable() {
    return Mark(MARK_AS_MOBX_OBSERVABLE, true);
}

export function AutoObservable() {
    return Mark(MARK_AS_MOBX_AUTO_OBSERVABLE, true);
}

export type IoCProps = React.PropsWithChildren<{
    callback?: (appctx: ApplicationContext) => void;
}>;

export function IoC(props: IoCProps) {
    const ref = useRef<ApplicationContext>();
    if (!ref.current) {
        const appctx = new ApplicationContext();
        if (typeof props.callback === 'function') {
            props.callback(appctx);
        }
        appctx.registerInstAwareProcessor(
            class implements PartialInstAwareProcessor {
                afterInstantiation<T extends object>(instance: T): T {
                    const markInfo = appctx.getClassMetadata(instance.constructor as Newable<T>).getCtorMarkInfo();
                    if (markInfo[MARK_AS_MOBX_OBSERVABLE]) {
                        makeObservable(instance);
                    }
                    if(markInfo[MARK_AS_MOBX_AUTO_OBSERVABLE]) {
                        makeAutoObservable(instance);
                    }
                    return instance;
                }
            }
        );
        ref.current = appctx;
    }
    return React.createElement(
        IoCContext.Provider,
        {
            value: ref.current
        },
        props.children
    );
}

export function useService<T>(ctor: Newable<T>): T {
    const ctx = useContext(IoCContext);
    if (!ctx) {
        throw new Error('<IoC></IoC> has not been applied to the component.');
    }
    return ctx.getInstance(ctor);
}

export function renderObserver(render: () => React.ReactElement) {
    return React.createElement(
        Observer,
        {
            render: render
        },
        []
    ) as React.ReactElement
}

export * from '@vgerbot/ioc';
