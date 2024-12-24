import { DependencyList, EffectCallback, useEffect, useRef } from "react";

/**
 * useIsFirstRender
 * @return {boolean}
 */
export function useIsFirstRender(): boolean {
    const isFirst = useRef(true);

    if (isFirst.current) {
        isFirst.current = false;

        return true;
    }

    return isFirst.current;
}

/**
 * useUpdateEffect
 * @param {EffectCallback} effect
 * @param {DependencyList} deps
 */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
    const isFirst = useIsFirstRender();

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (!isFirst) {
            return effect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
