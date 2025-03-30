import { render, screen } from "@testing-library/react";
import { ExcelContext, ExcelContextType } from "./ExcelContext";
import { Tab } from "../types/Tab";

const mockContextValue: ExcelContextType = {
  sheets: ["Sheet1", "Sheet2"],
  optimisticSheet: "Sheet1",
  jsonData: '{"name": "John", "age": 30}',
  handleFileChange: vi.fn(),
  handleSheetChange: vi.fn(),
  downloadJson: vi.fn(),
  activeTab: Tab.EXCEL_TO_JSON,
  handleTabChange: vi.fn(),
  jsonInput: "",
  setJsonInput: vi.fn(),
  convertJsonToExcel: vi.fn(),
};

const MockConsumer = () => {
  return (
    <ExcelContext.Consumer>
      {(context) =>
        context ? (
          <div>
            <span data-testid="sheets">{JSON.stringify(context.sheets)}</span>
            <span data-testid="optimisticSheet">{context.optimisticSheet}</span>
            <span data-testid="jsonData">{context.jsonData}</span>
            <span data-testid="activeTab">{context.activeTab}</span>
          </div>
        ) : (
          <span data-testid="no-context">No Context</span>
        )
      }
    </ExcelContext.Consumer>
  );
};

describe("ExcelContext", () => {
  it("provides the expected context values", () => {
    render(
      <ExcelContext.Provider value={mockContextValue}>
        <MockConsumer />
      </ExcelContext.Provider>
    );

    expect(screen.getByTestId("sheets")).toHaveTextContent('["Sheet1","Sheet2"]');
    expect(screen.getByTestId("optimisticSheet")).toHaveTextContent("Sheet1");
    expect(screen.getByTestId("jsonData")).toHaveTextContent('{"name": "John", "age": 30}');
    expect(screen.getByTestId("activeTab")).toHaveTextContent(Tab.EXCEL_TO_JSON);
  });

  it("shows 'No Context' when not wrapped in provider", () => {
    render(<MockConsumer />);
    expect(screen.getByTestId("no-context")).toHaveTextContent("No Context");
  });
});
