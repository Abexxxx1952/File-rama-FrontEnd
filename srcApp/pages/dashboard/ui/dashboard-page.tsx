import { FileSystemItemType } from "@/srcApp/entities/fileSystemItem/model/types";
import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/ui/dashboardItem";
import { Input } from "@/srcApp/shared/ui/input";
import { Logo } from "@/srcApp/shared/ui/logo";
import styles from "./styles.module.css";

export function DashboardPage() {
  const data: FileSystemItemType[] = [
    {
      id: "ba3e64a0-4e2d-4a4e-8924-195e06020a1b",
      folderName: "Frst Folder",
      userId: "813e0c7d-cd82-4ebc-8447-8d2a59d66f95",
      parentFolderId: null,
      createdDate: "2025-02-07T12:57:40.701Z",
      isPublic: false,
    },
    {
      id: "7978ab52-d214-4f7d-b894-66e7eb8ed269",
      userId: "813e0c7d-cd82-4ebc-8447-8d2a59d66f95",
      fileUrl:
        "https://drive.google.com/file/d/1gfxg4JdtiuihHop1yCnEbmwM_COVLZo-/view?usp=drivesdk",
      fileDownloadUrl:
        "https://drive.google.com/uc?id=1gfxg4JdtiuihHop1yCnEbmwM_COVLZo-&export=download",
      fileName:
        "rimkhamart1_Mechanical_PhoenixCreate_a_futuristic_robotic_versi_d8bb0f01-fce3-4f11-8c77-cb1083cda2ef(1) (1).png",
      fileExtension: "png",
      fileSize: "1677427",
      parentFolderId: null,
      fileGoogleDriveId: "1gfxg4JdtiuihHop1yCnEbmwM_COVLZo-",
      fileGoogleDriveParentFolderId: "1kM_yeDo1Ib3cWGWNRvugWsXeHGxuUS_F",
      fileGoogleDriveClientEmail:
        "google-drive@fiery-booth-447215-n7.iam.gserviceaccount.com",
      uploadDate: "2025-01-20T12:50:28.010Z",
      fileDescription: null,
      isPublic: false,
    },
    {
      id: "fb3bc694-1bd7-443b-9d0f-92b23cc690d3",
      userId: "813e0c7d-cd82-4ebc-8447-8d2a59d66f95",
      fileUrl:
        "https://drive.google.com/file/d/1y59NXgEclDDwjkk8OE7iPbA6oJJfuqcx/view?usp=drivesdk",
      fileDownloadUrl:
        "https://drive.google.com/uc?id=1y59NXgEclDDwjkk8OE7iPbA6oJJfuqcx&export=download",
      fileName:
        "rimkhamart1_Mechanical_PhoenixCreate_a_futuristic_robotic_versi_d8bb0f01-fce3-4f11-8c77-cb1083cda2ef(1).png",
      fileExtension: "png",
      fileSize: "1677427",
      parentFolderId: null,
      fileGoogleDriveId: "1y59NXgEclDDwjkk8OE7iPbA6oJJfuqcx",
      fileGoogleDriveParentFolderId: "1kM_yeDo1Ib3cWGWNRvugWsXeHGxuUS_F",
      fileGoogleDriveClientEmail:
        "google-drive@fiery-booth-447215-n7.iam.gserviceaccount.com",
      uploadDate: "2025-01-20T12:43:10.817Z",
      fileDescription: null,
      isPublic: false,
    },
    {
      id: "baef47d3-87cb-4d38-94d7-6c29354c7cf6",
      userId: "813e0c7d-cd82-4ebc-8447-8d2a59d66f95",
      fileUrl:
        "https://drive.google.com/file/d/17wsnjdLEgq4RP4UudmzFCrH4JNeMSgML/view?usp=drivesdk",
      fileDownloadUrl:
        "https://drive.google.com/uc?id=17wsnjdLEgq4RP4UudmzFCrH4JNeMSgML&export=download",
      fileName:
        "rimkhamart1_Mechanical_PhoenixCreate_a_futuristic_robotic_versi_d8bb0f01-fce3-4f11-8c77-cb1083cda2ef(1) (2).png",
      fileExtension: "png",
      fileSize: "1677427",
      parentFolderId: null,
      fileGoogleDriveId: "17wsnjdLEgq4RP4UudmzFCrH4JNeMSgML",
      fileGoogleDriveParentFolderId: "1kM_yeDo1Ib3cWGWNRvugWsXeHGxuUS_F",
      fileGoogleDriveClientEmail:
        "google-drive@fiery-booth-447215-n7.iam.gserviceaccount.com",
      uploadDate: "2025-01-23T12:45:56.047Z",
      fileDescription: null,
      isPublic: false,
    },
  ];
  return (
    <>
      <div className={styles.storage__search}>
        <div className={styles.storage__logo}>
          <Logo />
        </div>
        <div className={styles.storage__searchInput}>
          <Input
            placeholder="Search"
            backgroundColor="rgb(255, 255, 255)"
            focusBackgroundColor="rgb(255, 255, 255)"
            border="none"
            placeholderPaddingLeft="1.5rem"
            iconSvg="svg/dashboard-page-sprite.svg#search"
            iconSvgWidth="17px"
            iconSvgHeight="16px"
          />
        </div>
      </div>
      <div className={styles.storage__content}>
        <div className={styles.storage__table}>
          <div className={styles.tableHeader}>
            <span
              className={`${styles.tableHeader__name} ${styles.tableHeader__column}`}
            >
              Name
            </span>

            <span
              className={`${styles.tableHeader__size} ${styles.tableHeader__column}`}
            >
              Size
            </span>
            <span
              className={`${styles.tableHeader__uploadDate} ${styles.tableHeader__column}`}
            >
              Upload Date
            </span>
            <span
              className={`${styles.tableHeader__public} ${styles.tableHeader__column}`}
            >
              Public
            </span>
          </div>
          {data.map((elem) => {
            return <FileSystemItem key={elem.id} item={elem} />;
          })}
        </div>
      </div>
    </>
  );
}
