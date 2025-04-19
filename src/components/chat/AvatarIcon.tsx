interface AvatarIconProps {
  profilePicture?: string;
  username?: string;
  fallbackLetter?: string;
  gradientFrom: string;
  gradientTo: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarIcon = ({
  profilePicture,
  username,
  fallbackLetter = 'U',
  gradientFrom,
  gradientTo,
  size = 'sm'
}: AvatarIconProps) => {

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 md:w-12 md:h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };
  
  return profilePicture ? (
    <img
      src={profilePicture}
      alt={username || "Profile"}
      className={`${sizeClasses[size]} rounded-full object-cover ${size === 'md' ? 'border-2 border-zinc-800' : ''}`}
    />
  ) : (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-${gradientFrom} to-${gradientTo} flex items-center justify-center text-white font-bold`}>
      {username?.charAt(0)?.toUpperCase() || fallbackLetter}
    </div>
  );
}; 