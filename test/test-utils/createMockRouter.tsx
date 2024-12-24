import { NextRouter } from "next/router";

/**
 * createMockRouter
 * @param {Partial<NextRouter>} router
 * @return {Object}
 */
function createMockRouter(router: Partial<NextRouter>): NextRouter {
    return {
        basePath: "",
        pathname: "/",
        route: "/",
        query: {},
        asPath: "/",
        back: jest.fn(),
        beforePopState: jest.fn(),
        prefetch: jest.fn(),
        push: jest.fn(),
        reload: jest.fn(),
        replace: jest.fn(),
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        },
        isFallback: false,
        isLocaleDomain: false,
        isReady: true,
        defaultLocale: "en",
        domainLocales: [],
        isPreview: false,
        forward: jest.fn(),
        ...router,
    };
}

export default createMockRouter;
