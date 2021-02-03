const Footer: React.FC = () => {
  return (
    <span className="text-gray-400 text-xs absolute bottom-8 left-0 right-0 mx-auto text-center">
      &copy; Copyright {new Date().getFullYear()} | Codevcast
    </span>
  )
};

export default Footer;