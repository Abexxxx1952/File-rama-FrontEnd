import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "../debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should delay function execution", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should cancel previous timeout on multiple calls", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    vi.advanceTimersByTime(500);
    debouncedFunc();
    vi.advanceTimersByTime(500);

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments to the debounced function", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc("arg1", "arg2", 123);
    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  it("should use the latest arguments when called multiple times", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc("first");
    vi.advanceTimersByTime(500);
    debouncedFunc("second");
    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("second");
  });

  it("should work with different delay values", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();
    vi.advanceTimersByTime(499);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple independent debounced functions", () => {
    const func1 = vi.fn();
    const func2 = vi.fn();
    const debouncedFunc1 = debounce(func1, 1000);
    const debouncedFunc2 = debounce(func2, 500);

    debouncedFunc1();
    debouncedFunc2();

    vi.advanceTimersByTime(500);
    expect(func1).not.toHaveBeenCalled();
    expect(func2).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);
    expect(func1).toHaveBeenCalledTimes(1);
  });

  it("should work with functions that have no arguments", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith();
  });
});
