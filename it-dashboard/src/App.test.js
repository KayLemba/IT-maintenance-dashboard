import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

test("renders the Tactivo FieldOps command centre", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: /create your administrator account/i })).toBeTruthy();
  expect(screen.getByText("TACTIVO")).toBeTruthy();
  expect(screen.getByRole("button", { name: /create administrator account/i })).toBeTruthy();
  expect(screen.getByAltText(/tactivo technologies logo/i).getAttribute("src")).toBe("/assets/tactivo-logo-transparent.png");
});

function signInAsAdmin() {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Tactivo Administrator" } });
  fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: "admin@tactivotechnologies.com" } });
  fireEvent.change(screen.getByPlaceholderText(/at least 6 characters/i), { target: { value: "tactivo" } });
  fireEvent.change(screen.getByPlaceholderText(/re-enter passcode/i), { target: { value: "tactivo" } });
  fireEvent.click(screen.getByRole("button", { name: /create administrator account/i }));
}

function createTechnicianAccount() {
  fireEvent.click(screen.getByRole("button", { name: /team access/i }));
  fireEvent.click(screen.getByRole("button", { name: /add user/i }));
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Field Technician" } });
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "technician@tactivotechnologies.com" } });
  fireEvent.change(screen.getByLabelText(/fieldops role/i), { target: { value: "technician" } });
  fireEvent.change(screen.getByLabelText(/^passcode/i), { target: { value: "tactivo" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
}

test("allows a new Administrator to sign up, enter FieldOps, and sign out", () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Amina Mulenga" } });
  fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: "amina@tactivotechnologies.com" } });
  fireEvent.change(screen.getByPlaceholderText(/at least 6 characters/i), { target: { value: "fieldops7" } });
  fireEvent.change(screen.getByPlaceholderText(/re-enter passcode/i), { target: { value: "fieldops7" } });
  fireEvent.click(screen.getByRole("button", { name: /create administrator account/i }));
  expect(screen.getByRole("heading", { name: /command centre/i })).toBeTruthy();
  expect(screen.getByText(/administrator account created/i)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
  expect(screen.getByRole("heading", { name: /sign in to fieldops/i })).toBeTruthy();
  fireEvent.change(screen.getByPlaceholderText(/enter passcode/i), { target: { value: "fieldops7" } });
  fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
  expect(screen.getByRole("heading", { name: /command centre/i })).toBeTruthy();
});

test("signs in and creates a maintenance request", () => {
  render(<App />);
  signInAsAdmin();
  expect(screen.getByRole("heading", { name: /command centre/i })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /new maintenance request/i }));
  fireEvent.change(screen.getByLabelText(/request title/i), { target: { value: "Forecourt connectivity check" } });
  fireEvent.change(screen.getByLabelText(/issue summary/i), { target: { value: "Verify the forecourt controller connection." } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  expect(screen.getByText(/forecourt connectivity check/i)).toBeTruthy();
});

test("allows an Admin to open team access and user-role controls", () => {
  render(<App />);
  signInAsAdmin();
  fireEvent.click(screen.getByRole("button", { name: /team access/i }));
  fireEvent.click(screen.getByRole("button", { name: /add user/i }));
  expect(screen.getByLabelText(/fieldops role/i)).toBeTruthy();
  expect(screen.getAllByText(/field technician/i).length).toBeGreaterThan(0);
});

test("allows an Admin to create a role-assigned user", () => {
  render(<App />);
  signInAsAdmin();
  fireEvent.click(screen.getByRole("button", { name: /team access/i }));
  fireEvent.click(screen.getByRole("button", { name: /add user/i }));
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Service Planner" } });
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "planner@tactivotechnologies.com" } });
  fireEvent.change(screen.getByLabelText(/fieldops role/i), { target: { value: "supervisor" } });
  fireEvent.change(screen.getByLabelText(/^passcode/i), { target: { value: "secure123" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  expect(screen.getByText("Service Planner")).toBeTruthy();
  expect(screen.getByText("planner@tactivotechnologies.com")).toBeTruthy();
});

test("allows an Admin to open every operational record form", () => {
  render(<App />);
  signInAsAdmin();
  fireEvent.click(screen.getAllByRole("button", { name: /work orders/i })[0]);
  fireEvent.click(screen.getByRole("button", { name: /create work order/i }));
  expect(screen.getByLabelText(/work order title/i)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
  fireEvent.click(screen.getByRole("button", { name: /customer sites/i }));
  fireEvent.click(screen.getByRole("button", { name: /add site/i }));
  expect(screen.getByLabelText(/^site name/i)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
  fireEvent.click(screen.getByRole("button", { name: /assets & equipment/i }));
  fireEvent.click(screen.getByRole("button", { name: /add asset/i }));
  expect(screen.getByLabelText(/asset tag/i)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
  fireEvent.click(screen.getByRole("button", { name: /checklist library/i }));
  fireEvent.click(screen.getByRole("button", { name: /add checklist/i }));
  expect(screen.getByLabelText(/checklist points/i)).toBeTruthy();
});

test("allows an Admin to create work orders, sites, assets, and checklists", () => {
  render(<App />);
  signInAsAdmin();
  fireEvent.click(screen.getAllByRole("button", { name: /work orders/i })[0]);
  fireEvent.click(screen.getByRole("button", { name: /create work order/i }));
  fireEvent.change(screen.getByLabelText(/work order title/i), { target: { value: "Fuel system inspection" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  expect(screen.getByText(/fuel system inspection/i)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /customer sites/i }));
  fireEvent.click(screen.getByRole("button", { name: /add site/i }));
  fireEvent.change(screen.getByLabelText(/^site name/i), { target: { value: "Test service site" } });
  fireEvent.change(screen.getByLabelText(/^customer/i), { target: { value: "Tactivo Test Customer" } });
  fireEvent.change(screen.getByLabelText(/^location/i), { target: { value: "Lusaka" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  expect(screen.getByText("Test service site")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /assets & equipment/i }));
  fireEvent.click(screen.getByRole("button", { name: /add asset/i }));
  fireEvent.change(screen.getByLabelText(/asset name/i), { target: { value: "Test forecourt controller" } });
  fireEvent.change(screen.getByLabelText(/asset tag/i), { target: { value: "TEST-001" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  expect(screen.getByText("TEST-001")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /checklist library/i }));
  fireEvent.click(screen.getByRole("button", { name: /add checklist/i }));
  fireEvent.change(screen.getByLabelText(/checklist name/i), { target: { value: "Test field checklist" } });
  fireEvent.change(screen.getByLabelText(/checklist points/i), { target: { value: "Confirm system power" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  expect(screen.getByText("Test field checklist")).toBeTruthy();
});

test("allows an Admin to edit and delete another user", () => {
  window.confirm = () => true;
  render(<App />);
  signInAsAdmin();
  createTechnicianAccount();
  fireEvent.click(screen.getByRole("button", { name: /team access/i }));
  fireEvent.click(screen.getAllByRole("button", { name: /^edit$/i })[1]);
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Senior Service Supervisor" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  expect(screen.getByText("Senior Service Supervisor")).toBeTruthy();
  fireEvent.click(screen.getAllByRole("button", { name: /^delete$/i })[1]);
  expect(screen.queryByText("Senior Service Supervisor")).toBeNull();
});

test("shows technician profiles and opens photo and signature evidence for a work order", () => {
  render(<App />);
  signInAsAdmin();
  createTechnicianAccount();
  fireEvent.click(screen.getByRole("button", { name: /technician profiles/i }));
  fireEvent.click(screen.getByRole("button", { name: /add technician profile/i }));
  fireEvent.click(screen.getByRole("button", { name: /save profile/i }));
  expect(screen.getByRole("heading", { name: /technician profiles/i })).toBeTruthy();
  expect(screen.getByText(/zambia/i)).toBeTruthy();
  fireEvent.click(screen.getAllByRole("button", { name: /work orders/i })[0]);
  fireEvent.click(screen.getByRole("button", { name: /create work order/i }));
  fireEvent.change(screen.getByLabelText(/work order title/i), { target: { value: "Evidence capture check" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  fireEvent.click(screen.getByRole("button", { name: /add evidence/i }));
  expect(screen.getByText(/service photo/i)).toBeTruthy();
  expect(screen.getByLabelText(/draw technician signature/i)).toBeTruthy();
});

test("persists technician profile details", () => {
  render(<App />);
  signInAsAdmin();
  createTechnicianAccount();
  fireEvent.click(screen.getByRole("button", { name: /technician profiles/i }));
  fireEvent.click(screen.getByRole("button", { name: /add technician profile/i }));
  fireEvent.click(screen.getByRole("button", { name: /save profile/i }));
  fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
  fireEvent.change(screen.getByLabelText(/service region/i), { target: { value: "Copperbelt" } });
  fireEvent.change(screen.getByLabelText(/skills/i), { target: { value: "Fuel automation, Solar diagnostics" } });
  fireEvent.click(screen.getByRole("button", { name: /save profile/i }));
  expect(screen.getByText(/copperbelt/i)).toBeTruthy();
  expect(screen.getByText(/solar diagnostics/i)).toBeTruthy();
});

test("saves photo and signature evidence and previews the saved signature", () => {
  const originalReader = window.FileReader;
  const originalContext = HTMLCanvasElement.prototype.getContext;
  const originalDataUrl = HTMLCanvasElement.prototype.toDataURL;
  window.FileReader = class { readAsDataURL() { this.result = "data:image/png;base64,photo"; this.onload(); } };
  HTMLCanvasElement.prototype.getContext = () => ({ beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, clearRect() {} });
  HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,signature";
  render(<App />);
  signInAsAdmin();
  fireEvent.click(screen.getAllByRole("button", { name: /work orders/i })[0]);
  fireEvent.click(screen.getByRole("button", { name: /create work order/i }));
  fireEvent.change(screen.getByLabelText(/work order title/i), { target: { value: "Evidence ready service" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  fireEvent.click(screen.getByRole("button", { name: /add evidence/i }));
  fireEvent.change(screen.getByLabelText(/service photo/i), { target: { files: [new File(["image"], "evidence.png", { type: "image/png" })] } });
  fireEvent.pointerDown(screen.getByLabelText(/draw technician signature/i), { clientX: 8, clientY: 8, pointerId: 1 });
  fireEvent.pointerMove(screen.getByLabelText(/draw technician signature/i), { clientX: 44, clientY: 35, pointerId: 1 });
  fireEvent.pointerUp(screen.getByLabelText(/draw technician signature/i), { clientX: 44, clientY: 35, pointerId: 1 });
  fireEvent.click(screen.getByRole("button", { name: /save evidence/i }));
  fireEvent.click(screen.getByRole("button", { name: /^evidence$/i }));
  expect(screen.getByAltText(/work-order evidence/i)).toBeTruthy();
  expect(screen.getByAltText(/saved technician signature/i)).toBeTruthy();
  window.FileReader = originalReader;
  HTMLCanvasElement.prototype.getContext = originalContext;
  HTMLCanvasElement.prototype.toDataURL = originalDataUrl;
});

test("requires technician signature evidence before work-order completion", () => {
  const originalContext = HTMLCanvasElement.prototype.getContext;
  const originalDataUrl = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.getContext = () => ({ beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, clearRect() {} });
  HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,completion-signature";
  render(<App />);
  signInAsAdmin();
  createTechnicianAccount();
  fireEvent.click(screen.getAllByRole("button", { name: /work orders/i })[0]);
  fireEvent.click(screen.getByRole("button", { name: /create work order/i }));
  fireEvent.change(screen.getByLabelText(/work order title/i), { target: { value: "Technician completion check" } });
  fireEvent.change(screen.getByLabelText(/assigned technician/i), { target: { value: screen.getByLabelText(/assigned technician/i).options[1].value } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
  fireEvent.change(screen.getByLabelText(/^account/i), { target: { value: screen.getByLabelText(/^account/i).options[1].value } });
  fireEvent.change(screen.getByPlaceholderText(/enter passcode/i), { target: { value: "tactivo" } });
  fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
  fireEvent.click(screen.getAllByRole("button", { name: /work orders/i })[0]);
  fireEvent.click(screen.getByRole("button", { name: /update status/i }));
  fireEvent.click(screen.getByRole("button", { name: /update status/i }));
  fireEvent.click(screen.getByRole("button", { name: /save evidence/i }));
  expect(screen.getByText(/signature is required/i)).toBeTruthy();
  fireEvent.pointerDown(screen.getByLabelText(/draw technician signature/i), { clientX: 8, clientY: 8, pointerId: 1 });
  fireEvent.pointerMove(screen.getByLabelText(/draw technician signature/i), { clientX: 44, clientY: 35, pointerId: 1 });
  fireEvent.pointerUp(screen.getByLabelText(/draw technician signature/i), { clientX: 44, clientY: 35, pointerId: 1 });
  fireEvent.click(screen.getByRole("button", { name: /save evidence/i }));
  fireEvent.click(screen.getByRole("button", { name: /update status/i }));
  expect(screen.getByText(/^completed$/i)).toBeTruthy();
  HTMLCanvasElement.prototype.getContext = originalContext;
  HTMLCanvasElement.prototype.toDataURL = originalDataUrl;
});
