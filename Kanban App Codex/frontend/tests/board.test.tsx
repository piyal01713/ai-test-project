import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Board } from "../components/board";

describe("Board", () => {
  it("renders five populated columns", () => {
    render(<Board />);
    expect(screen.getByLabelText("Q3 roadmap board")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ideas")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Done")).toBeInTheDocument();
    expect(screen.getByText("Customer interview insights")).toBeInTheDocument();
  });

  it("adds and deletes a card", () => {
    render(<Board />);
    fireEvent.click(screen.getByRole("button", { name: /new card/i }));
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Clarify scope" } });
    fireEvent.click(within(screen.getByRole("form", { name: "Add a new card" })).getByRole("button", { name: "Add card" }));
    expect(screen.getByText("Clarify scope")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete Clarify scope" }));
    expect(screen.queryByText("Clarify scope")).not.toBeInTheDocument();
  });

  it("renames a column", () => {
    render(<Board />);
    fireEvent.change(screen.getByLabelText("Ideas column name"), { target: { value: "Research" } });
    expect(screen.getByDisplayValue("Research")).toBeInTheDocument();
  });

  it("moves a card between columns by drag and drop", () => {
    render(<Board />);
    const card = screen.getByText("Command menu").closest("article");
    const target = screen.getByLabelText("Done column name").closest("section");
    expect(card).not.toBeNull();
    expect(target).not.toBeNull();
    fireEvent.dragStart(card!);
    fireEvent.drop(target!);
    expect(within(target!).getByText("Command menu")).toBeInTheDocument();
  });
});
