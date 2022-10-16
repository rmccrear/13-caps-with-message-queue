import { createVendor } from "./index";

jest.mock("socket.io-client")

describe('Vendor Model', () => {
    test('should createVendor', () => {
        const vendor = createVendor();

        expect(vendor.name).toBeTruthy();
        expect(vendor.id).toBeTruthy();
        
    });
    
});