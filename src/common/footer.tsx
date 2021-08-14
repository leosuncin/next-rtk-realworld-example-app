import NextLink from 'next/link';

function Footer() {
  return (
    <footer>
      <div className="container">
        <NextLink href="/">
          <a className="logo-font">conduit</a>
        </NextLink>
        <span className="attribution">
          An interactive learning project from{' '}
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
