import { jest } from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

describe("voucher service unit test", () => {
  let code, discount, amount, voucher, expectedError;

  beforeEach(() => {
    code = "testCode";
    discount = 10;
    amount = 100;
    voucher = { id: 1, code, discount, used: false };
    expectedError = {
      type: expect.any(String),
      message: expect.any(String),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createVoucher()", () => {
    it("should return an error when code already exists", async () => {
      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockReturnValue({} as any);

      await expect(
        voucherService.createVoucher(code, discount)
      ).rejects.toEqual(expectedError);
    });

    it("should create voucher", async () => {
      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockReturnValue(undefined);
      jest.spyOn(voucherRepository, "createVoucher").mockReturnValue(undefined);

      await expect(
        voucherService.createVoucher(code, discount)
      ).resolves.toEqual(undefined);
    });
  });

  describe("applyVoucher()", () => {
    it("should return an error if voucher does not exist", async () => {
      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockReturnValue(undefined);

      await expect(voucherService.applyVoucher(code, amount)).rejects.toEqual(
        expectedError
      );
    });

    it("should not apply voucher if amount given is invalid", async () => {
      const invalidAmount = amount - 1;

      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockReturnValue(voucher);

      const result = await voucherService.applyVoucher(code, invalidAmount);

      expect(result).toEqual({
        amount: invalidAmount,
        discount: voucher.discount,
        finalAmount: invalidAmount,
        applied: false,
      });
    });

    it("should not apply voucher if voucher is already used", async () => {
      const usedVoucher = { ...voucher, used: true };

      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockReturnValue(usedVoucher);

      const result = await voucherService.applyVoucher(code, amount);

      expect(result).toEqual({
        amount,
        discount: voucher.discount,
        finalAmount: amount,
        applied: false,
      });
    });

    it("should use voucher", async () => {
      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockReturnValue(voucher);
      jest.spyOn(voucherRepository, "useVoucher").mockReturnValue(undefined);

      const result = await voucherService.applyVoucher(code, amount);

      expect(result).toEqual({
        amount,
        discount: voucher.discount,
        finalAmount: amount - amount * (voucher.discount / 100),
        applied: true,
      });
    });
  });
});
