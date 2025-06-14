
interface PartsHeaderProps {}

export const PartsHeader = ({}: PartsHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-poppins font-bold">Servis Parçaları</h1>
      <p className="text-muted-foreground">Servis işlemlerinde kullanılan tüm parçaları görüntüleyin ve yönetin</p>
    </div>
  );
};
