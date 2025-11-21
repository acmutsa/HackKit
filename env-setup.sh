#!/bin/bash
set -e
installation_options=(
  "1) brew" 
  "2) npm" 
  "3) windows" 
  "4) aliple"
  )
echo "Welcome to Enviorment CLI setup for Infisical ✨"
echo "Please select a method to install the Infisical CLI"
printf "%s\n" "${installation_options[@]}"
read -r -p "Please select an option: " installation_option

case $installation_option in
  1)
    echo "Installing via brew..."
    brew install infisical/get-cli/infisical
    ;;
  2)
    echo "Installing via npm..."
    npm install -g @infisical/cli
    ;;
  3)
    echo "Installing via windows..."
    scoop bucket add org https://github.com/Infisical/scoop-infisical.git
    scoop install infisical
    ;;
  4)
    echo "Installing via aliple..."
    apk add --no-cache bash sudo
    curl -1sLf \
	'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' \
| bash
;;
  # default case
  *)
    echo "Invalid option. Please select a valid option."
    exit 1
    ;;
esac

printf "Infisical CLI installed successfully!\n\n"
echo "Next, log in to the Infisical CLI. When prompted, please select custom 'Self-Hosting or Dedicated Instance'"
infisical login
printf "\n\nNow, we are going to initialize the Infisical enviorment\n"
infisical init
printf "\n\nAlmost there! Setting grabbing the enviorment variables...\n"
infisical export > .env
printf "\n\nGreat! You can run the command 'infisical export > .env' anytime you want to update your enviorment variables 🔥\n"
read -r -p "For ease of use, would you like a shortcut for the command? (y/n) " shortcut
if [ $shortcut == "y" ]; then
  read -r -p "Please type which profile you are using (e.g. bash, zsh, etc) " profile
  
  if [ $profile == "bash" ]; then
    if grep -q "alias env-pull='infisical export > .env'" ~/.bash_profile; then
      echo "Shortcut already exists! You can run 'env-pull' to update your enviorment variables."
    else 
      echo "alias env-pull='infisical export > .env'" >> ~/.bash_profile
      echo "Shortcut created! You can now run 'env-pull' to update your enviorment variables."
      source ~/.bash_profile
    fi
  elif [ $profile == "zsh" ]; then
    if grep -q "alias env-pull='infisical export > .env'" ~/.zshrc; then
      echo "Shortcut already exists! You can run 'env-pull' to update your enviorment variables."
    else 
      echo "alias env-pull='infisical export > .env'" >> ~/.zshrc
      echo "Shortcut created! You can now run 'env-pull' to update your enviorment variables."
      source ~/.zshrc
    fi
  else
    echo "Profile not supported. Please add the alias 'alias env-pull='infisical export > .env' to your profile."
  fi
fi
printf "\n\nSetup finished. Have a good day ✨\n"