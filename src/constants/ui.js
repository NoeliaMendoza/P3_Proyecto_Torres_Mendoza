export const getAvatarUrl = (nombre) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || 'Usuario')}&background=036666&color=fff&size=128`;
