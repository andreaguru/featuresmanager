import "@testing-library/jest-dom";
import { FeatSelectedStatus } from "types/componentProps.types";
import { mockedClientList, mockedFeatures } from "./mockData";
import { showFeaturesPerStatus } from "../pages/_app";

const showSelectedFeatures = jest.fn();
showSelectedFeatures.mockReturnValue(mockedFeatures);

jest.mock("services/DashboardAPI", () => ({
    getClientList: jest.fn(() => Promise.resolve(mockedClientList)),
    getFeaturesListPromise: jest.fn(() => Promise.resolve(mockedFeatures)),
}));

jest.mock("react-intersection-observer", () => ({
    useInView: () => [() => null, true], // Second value in array will be treated as 'inView'
}));

/* UNIT TESTS */
test("showFeaturesPerStatus returns the only Feature that is enabled", () => {
    const features = showFeaturesPerStatus(mockedFeatures, FeatSelectedStatus.ACTIVE);
    expect(features[0].key).toBe("traffective");
});

test("showFeaturesPerStatus returns the two Features that are not enabled", () => {
    const features = showFeaturesPerStatus(mockedFeatures, FeatSelectedStatus.INACTIVE);
    expect(features[0].key).toBe("inArticleReco");
});

test("showFeaturesPerStatus returns all the features (no features removed)", () => {
    const features = showFeaturesPerStatus(mockedFeatures, FeatSelectedStatus.ALL);
    expect(features[0].key).toBe("traffective");
    expect(features[1].key).toBe("inArticleReco");
    expect(features[2].key).toBe("cleverpush");
});
