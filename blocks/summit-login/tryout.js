//regex to match URL starting with either http or https and domain "store.ashleyfurniture.in" and having any alphanumeric character in URI   
const regex = /^(https?:\/\/store\.ashleyfurniture\.in\/[a-zA-Z0-9]+)$/gm;

// write test cases to match the regex
describe('URL starting with either http or https and domain "store.ashleyfurniture.in" and having any alphanumeric character in URI', () => {
  it('should match URL', () => {
    const str = `https://store.ashleyfurniture.in/abc`;
    expect(str).toMatch(regex);
  });

  it('should match URL', () => {
    const str = `http://store.ashleyfurniture.in/abc`;
    expect(str).toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in/`;
    expect(str).not.toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in`;
    expect(str).not.toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in/abc/def`;
    expect(str).not.toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in/abc/def/`;
    expect(str).not.toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in/abc/def/ghi`;
    expect(str).not.toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in/abc/def/ghi/`;
    expect(str).not.toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in/abc/def/ghi/jkl`;
    expect(str).not.toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in/abc/def/ghi/jkl/`;
    expect(str).not.toMatch(regex);
  });

  it('should not match URL', () => {
    const str = `https://store.ashleyfurniture.in/abc/def/ghi/jkl/mno`;
    expect(str).not.toMatch(regex);
  });
});
