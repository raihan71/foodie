interface IProps {
  size?: string;
  className?: string;
}

const Verified: React.FC<IProps> = ({size, className }) => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      title="Verified Account"
      className={`
        no-underline text-white bg-blue-400 inline-flex items-center rounded-full border border-blue-400 text-xs font-semibold pl-0.5 pt-0.5 pb-0.5 pr-0.5 leading-none
      `}
      >
      <span
        className={`
          inline-flex rounded-full bg-green-light text-white
        `}>
        <svg
          viewBox="0 0 20 20"
          className={`
            ${size === 'sm' ? 'h-4 w-4' :
              size === 'xs' ? 'h-2 w-2' :
              size === 'md' ? 'h-6 w-6' :
              size === 'lg' ? 'h-10 w-10': 'h-8 w-8'
            }
            ${className}
          `}
        >
          <path d="M5.8 9.4c-.33-.442-.958-.53-1.4-.2-.442.33-.53.958-.2 1.4l3 4c.38.508 1.134.537 1.553.06l7-8c.363-.417.32-1.05-.094-1.413-.417-.363-1.05-.32-1.413.094L8.06 12.414 5.8 9.4z" fill="#fff"></path>
        </svg>
      </span>
    </a>
  )
};

Verified.defaultProps = {
  size: 'xs',
  className: ''
}

export default Verified;