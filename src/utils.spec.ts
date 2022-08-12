import { formatISODateToUnixTimestamp } from './utils';

describe('formatISODateToUnixTimestamp', () => {
  it('returns the UNIX timestamp', () => {
    expect(formatISODateToUnixTimestamp('2021-08-09T02:12:51.254Z')).toBe(
      1628475171254,
    );
  });
});
