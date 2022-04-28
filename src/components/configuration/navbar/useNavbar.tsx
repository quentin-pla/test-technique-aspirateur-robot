import {useEffect, useState} from "react";
import {ConfigurationStep} from "../hooks/useConfiguration";

interface IUseNavbar {
    logoColor: string
}

const useNavbar = (currentStep: ConfigurationStep): IUseNavbar => {
    const [_logoColor, _setLogoColor] = useState<IUseNavbar["logoColor"]>("white");

    useEffect(() => {
        const handleResize = () => {
            let logoColor = getLogoColor();
            _setLogoColor(logoColor);
        }
        window.addEventListener('resize', handleResize);
    }, [])

    useEffect(() => {
        let logoColor = getLogoColor();
        if (logoColor === _logoColor) return;
        _setLogoColor(logoColor);
    }, [currentStep]);

    const getLogoColor = () => {
        let logoColor: string;
        // If width < 768px, we consider user is on mobile
        const isOnMobile = document.body.offsetWidth < 768;
        if (isOnMobile) logoColor = "black";
        else logoColor = currentStep === ConfigurationStep.Start ? "white" : "black";
        return logoColor;
    }

    return {
        logoColor: _logoColor
    }
}

export default useNavbar;