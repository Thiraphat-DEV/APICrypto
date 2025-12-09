import { Injectable } from '@nestjs/common';
import {DecryptionDTO, EncryptionDTO} from "./model/app.dto";
import {ResponseData} from "./result";
import {createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class AppService {
  private readonly private: string;
  constructor(
  ) {
    this.private = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9gEXa2Fh48tTs\n' +
        'AHfzIhYcRJdymJix831xwAnLsCWb4r3UrClFqymdsvYKteAUJ/biYut8/og8OGS2\n' +
        '+Tr7iMR0nogAsikomQF/rCaslAFr7zwcgJi94TlChWc82gTtUVNDYYAlPBXY0ULS\n' +
        'L2W9V8kXu38oQnL/YCyBdWqIk0KkdWuiK4irDq01hq/VKBMVJXcCVZxBiGx1gVvL\n' +
        'LBwGEMq2wXze8mKu+t7p4ZOZL2DoU3OtyQk1ROIj4inUu+jk8QAidAWNwawRtgGl\n' +
        'iX+AZNUH/kC3t4V/ylF1Jbz9pTNIi3CNmfN9w19f9CoVDuoHvSs7Q9BR2J0CyENC\n' +
        'Phx6DyBfAgMBAAECggEANjUKRnbaoAZ+p9/ecBtRDdcFJ4/FJipLuQ1BABYsO/JZ\n' +
        'cQuqZrZ2mhjGTvwF1F42Pj4jtMauu+M51ClpGOjfoahzqRdNtMJH7niVO4q++Vwe\n' +
        '6txSVQanNYMpq/uFq0k3MzAh0wTkDviVT8ClLst8x6An2KFhefHN6V5oEhdl2dsK\n' +
        '03dF/VpKIDlvvqzELmcuumgR7T0nL2R9uqCbsUxiIck2sMupAiGQ0Yr23yfuLl2A\n' +
        '2AiOkqi3X3SS+J3Xuix1rdgj8pM0OpEeQaUT8zrk3BuOMVyjHOWG0aLYpgQxEzeM\n' +
        'DtD/CFvfjSfqxt4uKtNylv7gfKAEMrHUoJKsWYSVmQKBgQDjQQiBtXCXgrNqd5Nt\n' +
        'x3MFWr15CTkcaSzyEX7wyUO6Aa8J2Tv0xiiaoC0RKiurc69oSd9pBHUYq6IabRqR\n' +
        'FHnP+S7yTsUy89pzYHN97Me31RjN7NmTjHhQknG5hgeP9rtiazt3FhOWP9nrYXTn\n' +
        'GbemrvOBNNUogwgzw3NU3xsShQKBgQDVeLfysyN+HYIW3fL+YEp4FBAVRgFVecF9\n' +
        '2hcMpoHiwRIPeTTJWYMztWi+N0L/XnD00vQsVZT/4natKhZduhhkvpTr/YUEbvB6\n' +
        'ePxr1vOC5DUfzxo9zLGcEIygjG3QqfpXtIl5wEH0ninzHwe4KmzX6LNYjlxv1TFC\n' +
        'qDEIhWDmkwKBgE20af04FiSoW0LXWkDaRvkYutrNDYsqZ2TqGJaqqw7KDpj2f6rF\n' +
        'qxKcHGzXF5GLf/nP8KVPEd76qPYSQlhDQRec47GUv5cZjKOQ4ky3jt7L7axUBV2P\n' +
        'VYBvYpWGP8W5Hv+bHP0uPkpM0O3MKBXxVDuZbMfMUeqFS2OvvBrUIsSlAoGBAJkc\n' +
        'cuOS9VwZkhsQqp8lNYSW70oy4fYK1GuOJ4YdT3/ydx++EcxxdZd7AFuei2Fava38\n' +
        'OMIryCkYp4Jgc5ZaSfDIeUwilGuvnrBZYsN+cz5orGnaQ7obvTBw9kyZLJLDuBl8\n' +
        'FjbLXQM1BmWo1gKT+2mJMEnOIiLcSO7EcBbqg6wdAoGAU2avH+gnSpCRI75XCl3g\n' +
        'js/HfTCzWqrbRSv30v9bA1BO/+grF0lti2nOoNeQzS+2nZPgRc948aA11EvKhTWd\n' +
        'qVdxqMhpbo6n3a5se/ZgjkqHo02VE4Xu1UIoj6JpgsfRhWPzP57cP8xGWmKdPG57\n' +
        '4wBm2qLmimSCYX5zQ1V9kTQ=';
  }
  async getEncryptionService(body: EncryptionDTO) {
    const aesRandomChar = randomBytes(Number(body.payload)).toString('hex');
    const key = Buffer.from(aesRandomChar, 'hex');
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key.slice(0, 32), iv);
    let encrypted = cipher.update(this.private, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return new ResponseData({data1: tag,data2: aesRandomChar});
  }


  async decryptionService(body: DecryptionDTO) {
    const firstData = body.data1;
    const secondData = body.data2;
    const [ivHex, tagHex, encryptedHex] = firstData.split(':');
    if (!ivHex || !tagHex || !encryptedHex) {
      throw new Error("Invalid encrypted format");
    }
    const key = Buffer.from(secondData, 'hex').slice(0, 32);
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return new ResponseData({payload: decrypted});
  }

}
