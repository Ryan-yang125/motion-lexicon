// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SortableTable } from "@/registry/components/sortable-table";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  useReducedMotion: () => true,
}));

type Row = { id: string; name: string };

describe("SortableTable markable layout", () => {
  it("allocates a 44px grid track for the 44px mark control", () => {
    render(
      <SortableTable<Row>
        label="Reviewers"
        rows={[{ id: "ada", name: "Ada" }]}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.name}
        markable
        columns={[{ id: "name", header: "Name", value: (row) => row.name }]}
      />,
    );

    const [header, row] = screen.getAllByRole("row");
    expect(header).toHaveStyle({ gridTemplateColumns: "44px minmax(0, 1fr)" });
    expect(row).toHaveStyle({ gridTemplateColumns: "44px minmax(0, 1fr)" });
    expect(screen.getByRole("button", { name: "Follow Ada" })).toHaveClass("size-11");
  });
});
