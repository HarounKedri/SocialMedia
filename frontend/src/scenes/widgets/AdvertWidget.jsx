import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="/assets/ad_pic.png"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>
          Lionel Messi is taking on Prime with a new sports drink
        </Typography>
        <Typography color={medium}>
          <a
            href="https://edition.cnn.com/2024/06/04/food/leo-messi-sports-drink/index.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: medium }}
          >
            Source
          </a>
        </Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        New York CNN — Logan Paul’s Prime drink has some new competition in the
        form of the G.O.A.T. Soccer superstar Lionel Messi has partnered with
        White Claw’s parent company to create a new hydration beverage, marking
        his entrance into the $33 billion category dominated by entrenched
        competitors Paul’s Prime, Gatorade and BodyArmor that have been vying
        for consumers’ growing thirst for energy drinks.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
