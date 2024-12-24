import "@testing-library/jest-dom";
import { ExpandedConfigMethod } from "types/context.types";
import { expandedConfigReducer } from "../pages/feature/[clientId]/[featurekey]";
import { mockedFeatureDetailForClient, mockedFeatures } from "./mockData";

jest.mock("services/DashboardAPI");

jest.mock("services/FeatureDetailAPI", () => ({
    getFeatureDetailForClient: jest.fn(() => Promise.resolve(mockedFeatureDetailForClient)),
    getUsagesPerFeature: jest.fn(() => Promise.resolve()),
}));

const showSelectedFeatures = jest.fn();
showSelectedFeatures.mockReturnValue(mockedFeatures);

jest.mock("react-intersection-observer", () => ({
    useInView: () => [() => null, true], // Second value in array will be treated as 'inView
}));

describe("Feature Detail Page", () => {
    // UNIT TESTS
    test("handles ExpandedConfigMethod.ADD", () => {
        const initialState = [1, 2, 3];
        const action = { type: ExpandedConfigMethod.ADD, payload: 4 };

        const newState = expandedConfigReducer(initialState, action);

        expect(newState).toContain(4);
        expect(newState.length).toBe(4);
    });

    test("handles ExpandedConfigMethod.REMOVE", () => {
        const initialState = [1, 2, 3];
        const action = { type: ExpandedConfigMethod.REMOVE, payload: 2 };

        const newState = expandedConfigReducer(initialState, action);

        expect(newState).not.toContain(2);
        expect(newState.length).toBe(2);
    });
});
