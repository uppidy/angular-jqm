if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo -e "Starting to update gh-pages for branch $TRAVIS_BRANCH\n"
  #copy data we're interested in to other place
  rm -fr $HOME/dist
  cp -R dist $HOME/dist
  #go to home and setup git
  cd $HOME
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis"
  #using token clone gh-pages branch
  rm -fr $HOME/gh-pages
  git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/opitzconsulting/angular-jqm.git  gh-pages > /dev/null

  #go into directory and copy data we're interested in to that directory
  cd gh-pages
  rm -fr $TRAVIS_BRANCH
  mkdir $TRAVIS_BRANCH
  cp -Rf $HOME/dist/* $TRAVIS_BRANCH
  zip -r $TRAVIS_BRANCH/angular-jqm.zip $HOME/dist

  # update root folder index.html with all existing versions
  echo "" > tmp_versionlinks
  LINK_TEMPLATE='<a href="%1/docs/index.html">%1</a>'
  for DIR in */
  do
      echo ${LINK_TEMPLATE//%1/${DIR%?}} >> tmp_versionlinks
  done
  sed -e '/<!--VERSION_LINKS-->/r tmp_versionlinks' < index.html.template > index.html
  rm tmp_versionlinks

  #add, commit and push files
  git add -A -f .
  git commit -am "chore(build): Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
  git push -fq origin gh-pages > /dev/null
  echo -e "Done updating gh-pages for branch $TRAVIS_BRANCH\n"
fi