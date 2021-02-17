const Footer: React.FC = () => {
  return (
    <span className="text-gray-400 text-xs absolute bottom-8 left-0 right-0 mx-auto text-center">
      &copy; Copyright {new Date().getFullYear()} | <a className="hover:underline" href="https://codevcast.com/" target="_blank" rel="noreferrer">Codevcast</a>
    </span>
  )
};

export default Footer;